import ExpoModulesCore
import UIKit

/// Shows a small non-fullscreen `UIWindow`, the way in-app-banner SDKs do.
public class BannerWindowModule: Module {
  private static var bannerWindow: UIWindow?

  public func definition() -> ModuleDefinition {
    Name("BannerWindow")

    AsyncFunction("show") {
      DispatchQueue.main.async {
        guard Self.bannerWindow == nil else { return }
        let scenes = UIApplication.shared.connectedScenes.compactMap { $0 as? UIWindowScene }
        guard let scene = scenes.first(where: { $0.activationState == .foregroundActive })
          ?? scenes.first
        else { return }

        let width: CGFloat = 300
        let window = UIWindow(windowScene: scene)
        window.frame = CGRect(
          x: (scene.screen.bounds.width - width) / 2, y: 88, width: width, height: 64)
        // Above the app windows, like a real banner SDK.
        window.windowLevel = .statusBar - 1
        window.layer.cornerRadius = 16
        window.clipsToBounds = true

        let controller = UIViewController()
        controller.view.backgroundColor = .systemIndigo
        let label = UILabel()
        label.text = "Banner in its own 300×64 UIWindow"
        label.textColor = .white
        label.font = .systemFont(ofSize: 13, weight: .semibold)
        label.textAlignment = .center
        label.numberOfLines = 0
        label.frame = controller.view.bounds
        label.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        controller.view.addSubview(label)

        window.rootViewController = controller
        window.isHidden = false
        Self.bannerWindow = window
      }
    }

    AsyncFunction("hide") {
      DispatchQueue.main.async {
        Self.bannerWindow?.isHidden = true
        Self.bannerWindow = nil
      }
    }
  }
}
